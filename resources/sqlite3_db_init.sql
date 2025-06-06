

-- conversation
-- id, title, date

-- message
-- id, conversation_id, timestamp, sender, content, extra (JSON blob)

create table if not exists conversation (
    id text primary key,
    title text,
    create_date text -- ISO string
);

create table if not exists message (
    id text primary key,
    conv_id text not null,
    create_date text, -- ISO string
    sender text not null,
    content text,
    extra text, -- JSON blob
    foreign key (conv_id) references conversation (id) on delete cascade    
);
