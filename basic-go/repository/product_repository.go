package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"basic-go-crud/models"
)

var (
	ErrNotFound = errors.New("produk tidak ditemukan")
)

type ProductRepository struct {
	db *sql.DB
}

func NewProductRepository(db *sql.DB) *ProductRepository {
	return &ProductRepository{db: db}
}

// FindAll mengambil daftar produk dengan filter opsional berdasarkan nama
func (r *ProductRepository) FindAll(ctx context.Context, search string) ([]models.Product, error) {
	query := `
		SELECT id, name, description, price, stock, created_at, updated_at
		FROM products
	`
	var args []interface{}
	if search != "" {
		query += " WHERE name ILIKE $1"
		args = append(args, "%"+search+"%")
	}
	query += " ORDER BY id DESC"

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("gagal query produk: %w", err)
	}
	defer rows.Close()

	products := make([]models.Product, 0)
	for rows.Next() {
		var p models.Product
		if err := rows.Scan(
			&p.ID,
			&p.Name,
			&p.Description,
			&p.Price,
			&p.Stock,
			&p.CreatedAt,
			&p.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("gagal scan baris produk: %w", err)
		}
		products = append(products, p)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterasi baris produk: %w", err)
	}

	return products, nil
}

// FindByID mengambil produk berdasarkan ID
func (r *ProductRepository) FindByID(ctx context.Context, id int64) (*models.Product, error) {
	query := `
		SELECT id, name, description, price, stock, created_at, updated_at
		FROM products
		WHERE id = $1
	`
	var p models.Product
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&p.ID,
		&p.Name,
		&p.Description,
		&p.Price,
		&p.Stock,
		&p.CreatedAt,
		&p.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("gagal query produk berdasarkan id: %w", err)
	}

	return &p, nil
}

// Create menambahkan produk baru ke database
func (r *ProductRepository) Create(ctx context.Context, input *models.CreateProductInput) (*models.Product, error) {
	query := `
		INSERT INTO products (name, description, price, stock)
		VALUES ($1, $2, $3, $4)
		RETURNING id, name, description, price, stock, created_at, updated_at
	`
	var p models.Product
	err := r.db.QueryRowContext(
		ctx,
		query,
		input.Name,
		input.Description,
		input.Price,
		input.Stock,
	).Scan(
		&p.ID,
		&p.Name,
		&p.Description,
		&p.Price,
		&p.Stock,
		&p.CreatedAt,
		&p.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("gagal membuat produk baru: %w", err)
	}

	return &p, nil
}

// Update memperbarui data produk berdasarkan ID
func (r *ProductRepository) Update(ctx context.Context, id int64, input *models.UpdateProductInput) (*models.Product, error) {
	query := `
		UPDATE products
		SET name = $1, description = $2, price = $3, stock = $4, updated_at = $5
		WHERE id = $6
		RETURNING id, name, description, price, stock, created_at, updated_at
	`
	var p models.Product
	err := r.db.QueryRowContext(
		ctx,
		query,
		input.Name,
		input.Description,
		input.Price,
		input.Stock,
		time.Now(),
		id,
	).Scan(
		&p.ID,
		&p.Name,
		&p.Description,
		&p.Price,
		&p.Stock,
		&p.CreatedAt,
		&p.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("gagal memperbarui produk: %w", err)
	}

	return &p, nil
}

// Delete menghapus produk berdasarkan ID
func (r *ProductRepository) Delete(ctx context.Context, id int64) error {
	query := `DELETE FROM products WHERE id = $1`
	res, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("gagal menghapus produk: %w", err)
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return fmt.Errorf("gagal memeriksa baris yang terhapus: %w", err)
	}

	if rowsAffected == 0 {
		return ErrNotFound
	}

	return nil
}
