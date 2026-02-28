package migrations

import (
	"os"
	"strconv"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/mailer"
)

func init() {
	m.Register(func(app core.App) error {
		host := os.Getenv("SMTP_HOST")
		portStr := os.Getenv("SMTP_PORT")
		username := os.Getenv("SMTP_USER")
		password := os.Getenv("SMTP_PASSWORD")
		sender := os.Getenv("EMAIL_SENDER")

		// If no SMTP host is provided, skip silently - email is optional
		if host == "" {
			return nil
		}

		port, err := strconv.Atoi(portStr)
		if err != nil || port == 0 {
			port = 587
		}

		// Port 465 is implicit TLS; anything else uses StartTLS
		tls := port == 465

		settings := app.Settings()

		settings.SMTP = core.SMTPConfig{
			Enabled:    true,
			Host:       host,
			Port:       port,
			Username:   username,
			Password:   password,
			TLS:        tls,
			AuthMethod: mailer.SMTPAuthPlain,
		}

		if sender != "" {
			settings.Meta.SenderAddress = sender
			// Reuse whatever SenderName is already set; only override the address
		}

		return app.Save(settings)
	}, func(app core.App) error {
		settings := app.Settings()
		settings.SMTP = core.SMTPConfig{
			Enabled: false,
		}
		return app.Save(settings)
	})
}
