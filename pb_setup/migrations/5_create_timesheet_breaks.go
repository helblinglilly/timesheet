package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		existing, _ := app.FindCollectionByNameOrId("timesheet_breaks")
		if existing != nil {
			return nil
		}

		entriesCollection, err := app.FindCollectionByNameOrId("timesheet_entries")
		if err != nil {
			return err
		}

		collection := core.NewBaseCollection("timesheet_breaks")

		collection.ListRule = strPtr("timesheet_entry.config.user.id = @request.auth.id || timesheet_entry.config.sharedUsers.id ?= @request.auth.id")
		collection.ViewRule = strPtr("timesheet_entry.config.user.id = @request.auth.id || timesheet_entry.config.sharedUsers.id ?= @request.auth.id")
		collection.CreateRule = strPtr("timesheet_entry.config.user.id = @request.auth.id || timesheet_entry.config.sharedUsers.id ?= @request.auth.id")
		collection.UpdateRule = strPtr("timesheet_entry.config.user.id = @request.auth.id || timesheet_entry.config.sharedUsers.id ?= @request.auth.id")
		collection.DeleteRule = strPtr("timesheet_entry.config.user.id = @request.auth.id || timesheet_entry.config.sharedUsers.id ?= @request.auth.id")

		collection.Fields.Add(
			&core.RelationField{
				Id:            "vuewlqg5",
				Name:          "timesheet_entry",
				Required:      true,
				CollectionId:  entriesCollection.Id,
				MaxSelect:     1,
				CascadeDelete: true,
			},
			&core.DateField{
				Id:       "6pghq512",
				Name:     "breakIn",
				Required: true,
			},
			&core.DateField{
				Id:       "rbisbzgv",
				Name:     "breakOut",
				Required: false,
			},
		)

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("timesheet_breaks")
		if err != nil {
			return err
		}
		return app.Delete(collection)
	})
}
