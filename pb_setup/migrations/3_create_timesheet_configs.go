package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		existing, _ := app.FindCollectionByNameOrId("timesheet_configs")
		if existing != nil {
			return nil
		}

		usersCollection, err := app.FindCollectionByNameOrId("users")
		if err != nil {
			return err
		}

		collection := core.NewBaseCollection("timesheet_configs")

		collection.ListRule = strPtr("user.id = @request.auth.id || sharedUsers.id ?= @request.auth.id")
		collection.ViewRule = strPtr("user.id = @request.auth.id || sharedUsers.id ?= @request.auth.id")
		collection.CreateRule = strPtr("user.id = @request.auth.id")
		collection.UpdateRule = strPtr("user.id = @request.auth.id || sharedUsers.id ?= @request.auth.id")
		collection.DeleteRule = strPtr("user.id = @request.auth.id")

		collection.Fields.Add(
			&core.RelationField{
				Id:            "lzf05lc0",
				Name:          "user",
				Required:      true,
				CollectionId:  usersCollection.Id,
				MaxSelect:     1,
				CascadeDelete: true,
			},
			&core.RelationField{
				Id:            "relation848400750",
				Name:          "sharedUsers",
				Required:      false,
				CollectionId:  usersCollection.Id,
				MaxSelect:     999,
				CascadeDelete: true,
			},
			&core.TextField{
				Id:       "nmoldyfb",
				Name:     "name",
				Required: true,
				Min:      1,
			},
			&core.NumberField{
				Id:      "irfeumf2",
				Name:    "minutesPerDay",
				OnlyInt: true,
			},
			&core.NumberField{
				Id:      "pphye73j",
				Name:    "daysPerWeek",
				OnlyInt: false,
			},
			&core.NumberField{
				Id:      "ifcvmnjh",
				Name:    "paidLunchMinutes",
				OnlyInt: true,
			},
			&core.NumberField{
				Id:      "number1363337956",
				Name:    "unpaidLunchMinutes",
				OnlyInt: true,
			},
		)

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("timesheet_configs")
		if err != nil {
			return err
		}
		return app.Delete(collection)
	})
}
