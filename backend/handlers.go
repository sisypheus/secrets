package main

import (
	"database/sql"
	"html"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

)

func CreateSecret(db *sql.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        var secret Secret
        if err := c.ShouldBindJSON(&secret); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        salt := make([]byte, 16)
        if _, err := DeriveKey([]byte(secret.Password), salt); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate key"})
            return
        }

        key, err := DeriveKey([]byte(secret.Password), salt)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate key"})
            return
        }

        encryptedContent, err := Encrypt(key, []byte(secret.Content))
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to encrypt content"})
            return
        }

        escapedContent := html.EscapeString(encryptedContent)

        id := uuid.New().String()
        _, err = db.Exec("INSERT INTO secrets (id, content, password) VALUES (?, ?, ?)", id, escapedContent, secret.Password)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store secret"})
            return
        }

        c.JSON(http.StatusCreated, gin.H{"id": id})
    }
}

func GetSecret(db *sql.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        id := c.Param("id")

        if _, err := uuid.Parse(id); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
            return
        }

        var request struct {
            Password string `json:"password"`
        }

        if err := c.ShouldBindJSON(&request); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        var escapedContent string
        var storedPassword string
        err := db.QueryRow("SELECT content, password FROM secrets WHERE id = ?", id).Scan(&escapedContent, &storedPassword)
        if err != nil {
            c.JSON(http.StatusNotFound, gin.H{"error": "Secret not found"})
            return
        }

        if request.Password != storedPassword {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect password"})
            return
        }

        encryptedContent := html.UnescapeString(escapedContent)

        salt := make([]byte, 16)
        key, err := DeriveKey([]byte(request.Password), salt)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate key"})
            return
        }

        decryptedContent, err := Decrypt(key, encryptedContent)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decrypt content"})
            return
        }

        c.String(http.StatusOK, string(decryptedContent))
    }
}