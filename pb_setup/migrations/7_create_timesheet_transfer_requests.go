package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		existing, _ := app.FindCollectionByNameOrId("timesheet_transfer_requests")
		if existing != nil {
			return nil
		}

		configCollection, err := app.FindCollectionByNameOrId("timesheet_configs")
		if err != nil {
			return err
		}

		collection := core.NewBaseCollection("timesheet_transfer_requests")

		collection.ListRule = strPtr("user_email:lower = @request.auth.email:lower || timesheet.user.id = @request.auth.id")
		collection.ViewRule = strPtr("user_email:lower = @request.auth.email:lower")
		collection.CreateRule = strPtr("timesheet.user.id = @request.auth.id")
		collection.UpdateRule = nil
		collection.DeleteRule = strPtr("user_email:lower = @request.auth.email:lower || timesheet.user.id = @request.auth.id")

		collection.Fields.Add(
			&core.RelationField{
				Id:            "relation2007296212",
				Name:          "timesheet",
				Required:      false,
				CollectionId:  configCollection.Id,
				MaxSelect:     1,
				CascadeDelete: false,
			},
			&core.EmailField{
				Id:       "email89163564",
				Name:     "user_email",
				Required: true,
			},
			&core.TextField{
				Id:       "text1864495378",
				Name:     "transfer_code",
				Required: true,
				Min:      32,
				Max:      64,
			},
			&core.DateField{
				Id:       "date261981154",
				Name:     "expires_at",
				Required: true,
			},
		)

		collection.Indexes = []string{
			"CREATE UNIQUE INDEX `idx_qV9yc86Da1` ON `timesheet_transfer_requests` (`user_email`, `timesheet`)",
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("timesheet_transfer_requests")
		if err != nil {
			return err
		}
		return app.Delete(collection)
	})
}
