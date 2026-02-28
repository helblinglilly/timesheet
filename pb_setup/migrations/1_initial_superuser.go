package migrations

import (
	"os"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		email := os.Getenv("POCKETBASE_SUPERUSER_EMAIL")
		password := os.Getenv("POCKETBASE_SUPERUSER_PASSWORD")

		if email == "" || password == "" {
			panic("POCKETBASE_SUPERUSER_EMAIL and POCKETBASE_SUPERUSER_PASSWORD must be set")
		}

		superusers, err := app.FindCollectionByNameOrId(core.CollectionNameSuperusers)
		if err != nil {
			return err
		}

		existing, _ := app.FindAuthRecordByEmail(core.CollectionNameSuperusers, email)
		if existing != nil {
			return nil
		}

		record := core.NewRecord(superusers)
		record.Set("email", email)
		record.Set("password", password)
		return app.Save(record)
	}, func(app core.App) error {
		email := os.Getenv("POCKETBASE_SUPERUSER_EMAIL")
		record, _ := app.FindAuthRecordByEmail(core.CollectionNameSuperusers, email)
		if record == nil {
			return nil
		}
		return app.Delete(record)
	})
}
