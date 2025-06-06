import type { Database as BetterSqlite3Database } from 'better-sqlite3'
import Database from 'better-sqlite3'
import fs from 'fs/promises'
import path from 'path'

import { app } from 'electron'
import { DDialog, DMessage } from '../types/dbTypes'

const db: BetterSqlite3Database = new Database('llm_desktop.db', {})
db.pragma('journal_mode = WAL')
const DB_INIT_SCRIPT_NAME = 'sqlite3_db_init.sql'
export const initDb = async () => {
  console.log('Initializing DB...')

  // Determine the correct path to the SQL file based on whether the app is packaged
  let sqlInitScriptPath
  if (app.isPackaged) {
    // TODO, verify packaged script
    sqlInitScriptPath = path.join(process.resourcesPath, DB_INIT_SCRIPT_NAME)
    console.log(`Running in packaged mode. SQL file path: ${sqlInitScriptPath}`)
  } else {
    sqlInitScriptPath = path.join(__dirname, '../../resources', DB_INIT_SCRIPT_NAME)
    console.log(`Running in development mode. SQL file path: ${sqlInitScriptPath}`)
  }

  await fs.access(sqlInitScriptPath) // Throws an error if file does not exist
  console.log(`SQL file found at: ${sqlInitScriptPath}`)

  // Read the SQL file content asynchronously
  const initScript = await fs.readFile(sqlInitScriptPath, 'utf8')

  db.exec(initScript)
  console.log('Initializing DB... Done')
}

////////////////////////////////
// DB types
////////////////////////////////

interface DB_CONVERSATION_ROW {
  id: string
  title: string
  create_date: string
}

interface DB_MESSAGE_ROW {
  id: string
  conv_id: string
  create_date: string
  sender: string
  content: string
  extra: string
}

////////////////////////////////
//  APIS
////////////////////////////////
export interface SaveDialogParams {
  dialog: DDialog
  messages: DMessage[]
}
export const saveDialog = ({ dialog, messages }: SaveDialogParams): void => {
  try {
    db.transaction(() => {
      deleteDialog(dialog.id)
      const addConversation = db.prepare(
        'INSERT INTO conversation (id, title, create_date) VALUES (@id, @title, @create_date)'
      )
      const conv = addConversation.run({
        id: dialog.id,
        title: dialog.title,
        create_date: dialog.timestamp
      })
      console.log('Inserted conv:', conv)

      const addMessage = db.prepare(
        'INSERT INTO message (id, conv_id, create_date, sender, content, extra) VALUES (?, ?, ?, ?, ?, ?)'
      )
      const addMessageTransaction = db.transaction((messages: DMessage[]) => {
        messages.forEach((m) =>
          addMessage.run(m.id, dialog.id, m.timestamp, m.sender, m.content, JSON.stringify(m.extra))
        )
      })

      addMessageTransaction(messages)
    })()
  } catch (e) {
    console.log('error saveDialog', e)
  }
}

export interface GetDialogResult {
  dialogInfo: DDialog
  messages: DMessage[]
}
export const getDialog = (dialogId: string): GetDialogResult => {
  const getDialogRequest = db.prepare('select * from conversation where id = @id')
  const dialog = getDialogRequest.get({
    id: dialogId
  }) as DB_CONVERSATION_ROW
  const getMessageRequest = db.prepare('select * from message where conv_id = @id')
  const messages = getMessageRequest.all({ id: dialog.id }) as DB_MESSAGE_ROW[]
  const messages2 = messages.map((m) => ({
    id: m.id,
    timestamp: m.create_date,
    sender: m.sender,
    content: m.content,
    extra: m.extra ? JSON.parse(m.extra as string) : undefined
  }))
  return {
    dialogInfo: { id: dialog.id, title: dialog.title, timestamp: dialog.create_date },
    messages: messages2
  }
}

export interface GetDialogsResult {
  dialogs: DDialog[]
}
export const getDialogs = (): GetDialogsResult => {
  const getConv = db.prepare('select * from conversation order by create_date desc')
  const result = getConv.all() as DB_CONVERSATION_ROW[]
  return { dialogs: result.map((r) => ({ id: r.id, timestamp: r.create_date, title: r.title })) }
}

export const deleteDialog = (dialogId: string): void => {
  console.log('deleteDialog', dialogId)
  const deleteDialog = db.prepare('delete from conversation where id = @id')
  deleteDialog.run({ id: dialogId })
}
