package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		existing, _ := app.FindCollectionByNameOrId("timesheet_entries")
		if existing != nil {
			return nil
		}

		configCollection, err := app.FindCollectionByNameOrId("timesheet_configs")
		if err != nil {
			return err
		}

		collection := core.NewBaseCollection("timesheet_entries")

		collection.ListRule = strPtr("config.user.id = @request.auth.id || config.sharedUsers.id ?= @request.auth.id")
		collection.ViewRule = strPtr("config.user.id = @request.auth.id || config.sharedUsers.id ?= @request.auth.id")
		collection.CreateRule = strPtr("config.user.id = @request.auth.id || config.sharedUsers.id ?= @request.auth.id")
		collection.UpdateRule = strPtr("config.user.id = @request.auth.id || config.sharedUsers.id ?= @request.auth.id")
		collection.DeleteRule = strPtr("config.user.id = @request.auth.id || config.sharedUsers.id ?= @request.auth.id")

		collection.Fields.Add(
			&core.RelationField{
				Id:            "gnydmkks",
				Name:          "config",
				Required:      true,
				CollectionId:  configCollection.Id,
				MaxSelect:     1,
				CascadeDelete: true,
			},
			&core.DateField{
				Id:       "67c6dtsg",
				Name:     "clockIn",
				Required: true,
			},
			&core.DateField{
				Id:       "3oikwocr",
				Name:     "clockOut",
				Required: false,
			},
		)

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("timesheet_entries")
		if err != nil {
			return err
		}
		return app.Delete(collection)
	})
}
