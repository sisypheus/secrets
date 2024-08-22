package main

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

func serveHTML(c *gin.Context) {
	c.File("index.html")
}

func createSecret(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var secret Secret
		if err := c.BindJSON(&secret); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		id, err := genID(16)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to encrypt content"})
			return
		}
		encryptedContent, err := encrypt(secret.Content)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to encrypt content"})
			return
		}

		_, err = db.Exec("INSERT INTO secrets (id, content) VALUES (?, ?)", id, encryptedContent)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save secret"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"id": id})
	}
}

func getSecret(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		var secret Secret
		err := db.QueryRow("SELECT id, content FROM secrets WHERE id = ?", id).Scan(&secret.ID, &secret.Content)
		if err != nil {
			if err == sql.ErrNoRows {
				c.JSON(http.StatusNotFound, gin.H{"error": "Secret not found"})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve secret"})
			}
			return
		}

		// 
		c.JSON(http.StatusOK, secret)
	}
}