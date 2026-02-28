package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		existing, _ := app.FindCollectionByNameOrId("users")
		if existing != nil {
			return nil
		}

		collection := core.NewAuthCollection("users")

		collection.ListRule = strPtr("id = @request.auth.id")
		collection.ViewRule = strPtr("id = @request.auth.id")
		collection.CreateRule = strPtr("")
		collection.UpdateRule = strPtr("id = @request.auth.id")
		collection.DeleteRule = strPtr("id = @request.auth.id")

		collection.OAuth2.Enabled = true
		collection.OAuth2.MappedFields = core.OAuth2KnownFields{
			Name:      "name",
			AvatarURL: "avatar",
		}

		collection.PasswordAuth.Enabled = true
		collection.PasswordAuth.IdentityFields = []string{"email"}

		collection.Fields.Add(
			&core.FileField{
				Id:        "users_avatar",
				Name:      "avatar",
				MaxSelect: 1,
				MaxSize:   5242880,
				MimeTypes: []string{
					"image/jpeg",
					"image/png",
					"image/svg+xml",
					"image/gif",
					"image/webp",
				},
			},
			&core.TextField{
				Id:   "3mopus8s",
				Name: "name",
			},
		)

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("users")
		if err != nil {
			return err
		}
		return app.Delete(collection)
	})
}
