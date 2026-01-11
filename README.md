# Timesheet

## Get started

```sh
npm i
cp .env.example .env

# Populate POCKETBASE_URL in the .env file
npm run dev
```

## Self-Hosting

This app creates a standalone Docker image for a NextJS app which can easily be self-hosted.

### Pocketbase (required)

The app relies on a Pocketbase instance. You can [build your own Docker image following their instructions](https://pocketbase.io/docs/going-to-production/#using-docker) or use a pre-made one by the community.

Once your instance is up and running, sign in and create an account.

### SMTP Email (recommended)

To allow for password resets, sign in alerts and Email verifications, populate the SMTP credentials within the Pocketbase UI.

For the sharing and transfering of Timesheets, populate the respective values in your `.env` file as well.

### OAuth providers (optional)

The app is usable without configuring any social providers. Providers will become available as they are populated in Pocketbase. See the documentation for each provider on how to create a client Id and secret.

### Sample docker compose
```yaml
# timesheet.docker-compose.yaml
services:
  timesheet_pb:
    # image: nxtgencat/pocketbase:0.29.0
    image: pocketbase:0.29.0
    # Alternatively, if you don't want to build the image yourself
    container_name: timesheet_pb
    restart: unless-stopped
    ports:
      - "8080:8080"
    volumes:
      - /your_save_directory:/pb/pb_data

  timesheet_app:
    ports:
      - "3000:3000"
    image: ghcr.io/helblinglilly/timesheet:main
    container_name: timesheet_app
    pull_policy: always
    restart: unless-stopped
    environment:
      # Required
      - POCKETBASE_URL=http://localhost:8080
      # Required for Sharing and Transfering timesheets
      - SMTP_HOST=""
      - SMTP_PORT=587
      - SMTP_USER=""
      - SMTP_PASSWORD=""
      - EMAIL_SENDER=""
    depends_on:
      timesheet_pb:
    # Optional, if you have watchtower running to keep the image up to date
    labels: { com.centurylinklabs.watchtower.enable: true }
```

To expose this service to the internet, either configure your own proxy like [Caddie](https://caddyserver.com/) or use something like [Cloudflare tunnels](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
