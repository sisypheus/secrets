package main

import (
    "database/sql"
    _ "github.com/mattn/go-sqlite3"
)

type Secret struct {
    ID       string `json:"id"`
    Content  string `json:"content"`
    Password string `json:"password"`
}

func InitDB(filepath string) (*sql.DB, error) {
    db, err := sql.Open("sqlite3", filepath)
    if err != nil {
        return nil, err
    }

    _, err = db.Exec(`
    CREATE TABLE IF NOT EXISTS secrets (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        password TEXT NOT NULL
    )`)

    if err != nil {
        return nil, err
    }

    return db, nil
}