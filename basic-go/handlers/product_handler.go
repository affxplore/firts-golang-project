package handlers

import (
	"errors"
	"net/http"
	"strconv"

	"basic-go-crud/models"
	"basic-go-crud/repository"

	"github.com/gin-gonic/gin"
)

type ProductHandler struct {
	repo *repository.ProductRepository
}

func NewProductHandler(repo *repository.ProductRepository) *ProductHandler {
	return &ProductHandler{repo: repo}
}

// HealthCheck memeriksa kesehatan server
func (h *ProductHandler) HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Server dan API berjalan normal",
		Data: gin.H{
			"status": "healthy",
		},
	})
}

// GetProducts mengambil semua data produk (bisa difilter dengan query param ?search=...)
func (h *ProductHandler) GetProducts(c *gin.Context) {
	search := c.Query("search")
	products, err := h.repo.FindAll(c.Request.Context(), search)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Message: "Gagal mengambil data produk",
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Berhasil mengambil data produk",
		Data:    products,
	})
}

// GetProductByID mengambil detail satu produk berdasarkan ID
func (h *ProductHandler) GetProductByID(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Message: "ID produk tidak valid",
			Error:   "Parameter id harus berupa bilangan bulat positif",
		})
		return
	}

	product, err := h.repo.FindByID(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			c.JSON(http.StatusNotFound, models.APIResponse{
				Success: false,
				Message: "Produk tidak ditemukan",
				Error:   err.Error(),
			})
			return
		}
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Message: "Gagal mengambil detail produk",
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Berhasil mengambil detail produk",
		Data:    product,
	})
}

// CreateProduct menambahkan produk baru
func (h *ProductHandler) CreateProduct(c *gin.Context) {
	var input models.CreateProductInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Message: "Payload request tidak valid",
			Error:   err.Error(),
		})
		return
	}

	product, err := h.repo.Create(c.Request.Context(), &input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Message: "Gagal menyimpan produk baru",
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, models.APIResponse{
		Success: true,
		Message: "Produk berhasil ditambahkan",
		Data:    product,
	})
}

// UpdateProduct memperbarui data produk
func (h *ProductHandler) UpdateProduct(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Message: "ID produk tidak valid",
			Error:   "Parameter id harus berupa bilangan bulat positif",
		})
		return
	}

	var input models.UpdateProductInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Message: "Payload request tidak valid",
			Error:   err.Error(),
		})
		return
	}

	product, err := h.repo.Update(c.Request.Context(), id, &input)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			c.JSON(http.StatusNotFound, models.APIResponse{
				Success: false,
				Message: "Produk tidak ditemukan",
				Error:   err.Error(),
			})
			return
		}
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Message: "Gagal memperbarui data produk",
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Produk berhasil diperbarui",
		Data:    product,
	})
}

// DeleteProduct menghapus produk berdasarkan ID
func (h *ProductHandler) DeleteProduct(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Message: "ID produk tidak valid",
			Error:   "Parameter id harus berupa bilangan bulat positif",
		})
		return
	}

	err = h.repo.Delete(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			c.JSON(http.StatusNotFound, models.APIResponse{
				Success: false,
				Message: "Produk tidak ditemukan",
				Error:   err.Error(),
			})
			return
		}
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Message: "Gagal menghapus produk",
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Produk berhasil dihapus",
	})
}
