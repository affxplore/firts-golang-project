package routes

import (
	"net/http"

	"basic-go-crud/handlers"

	"github.com/gin-gonic/gin"
)

// SetupRouter menginisialisasi router Gin dan mendefinisikan seluruh endpoint
func SetupRouter(handler *handlers.ProductHandler, ginMode string) *gin.Engine {
	gin.SetMode(ginMode)

	r := gin.New()

	// Middleware default: Logger dan Recovery dari panic
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	// Middleware CORS sederhana untuk mengizinkan request dari frontend
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	})

	// Endpoint health check
	r.GET("/health", handler.HealthCheck)

	// Route Group API Produk
	api := r.Group("/api")
	{
		products := api.Group("/products")
		{
			products.GET("", handler.GetProducts)
			products.GET("/:id", handler.GetProductByID)
			products.POST("", handler.CreateProduct)
			products.PUT("/:id", handler.UpdateProduct)
			products.DELETE("/:id", handler.DeleteProduct)
		}
	}

	return r
}
