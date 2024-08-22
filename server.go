package main

import (
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	db, err := InitDB("secrets.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	r := gin.Default()

	r.POST("/secrets", CreateSecret(db))
	r.POST("/secrets/:id", GetSecret(db))

	r.Run(":8080")
}
