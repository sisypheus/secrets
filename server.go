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

	router := gin.Default()
	
	router.GET("/", serveHTML)
	router.POST("/secrets", createSecret(db))
	router.GET("/secrets/:id", getSecret(db))

	log.Fatal(router.Run(":8080"))
}