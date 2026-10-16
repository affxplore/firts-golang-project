package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"basic-go-crud/config"
	"basic-go-crud/database"
	"basic-go-crud/handlers"
	"basic-go-crud/repository"
	"basic-go-crud/routes"
)

func main() {
	log.Println("[INFO] Memulai aplikasi Basic Go CRUD...")

	// 1. Muat konfigurasi
	cfg := config.LoadConfig()

	// 2. Hubungkan ke database PostgreSQL
	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatalf("[FATAL] Gagal menghubungkan ke database: %v", err)
	}
	defer func() {
		if err := db.Close(); err != nil {
			log.Printf("[WARN] Gagal menutup koneksi database: %v", err)
		}
	}()

	// 3. Inisialisasi layer repository, handler, dan router
	productRepo := repository.NewProductRepository(db)
	productHandler := handlers.NewProductHandler(productRepo)
	router := routes.SetupRouter(productHandler, cfg.GinMode)

	// 4. Inisialisasi HTTP server
	addr := ":" + cfg.Port
	srv := &http.Server{
		Addr:         addr,
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// 5. Jalankan server dalam goroutine terpisah
	go func() {
		log.Printf("[INFO] Server HTTP aktif dan mendengarkan pada port %s\n", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("[FATAL] Server error saat mendengarkan: %v\n", err)
		}
	}()

	// 6. Graceful Shutdown saat menerima sinyal SIGINT / SIGTERM
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("[INFO] Menerima sinyal shutdown, mematikan server secara graceful...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("[FATAL] Server dipaksa berhenti karena timeout: %v\n", err)
	}

	log.Println("[INFO] Server berhasil dimatikan dengan aman.")
}
