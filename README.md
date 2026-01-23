# Timesheet

## Get started

```sh
npm i
cp .env.example .env

# Populate POCKETBASE_URL in the .env file
npm run dev
```

## Self-Hosting

This app creates a Docker image for a NextJS app which can easily be self-hosted alongside a Pocketbase instance.

### Pocketbase (required)

The app relies on a Pocketbase instance. You can [build your own Docker image following their instructions](https://pocketbase.io/docs/going-to-production/#using-docker) or use a pre-made one by the community.

Once your instance is up and running, sign in and create an account. The credentials you use, will become the `POCKETBASE_SUPERUSER_EMAIL` and `POCKETBASE_SUPERUSER_PASSWORD` values.

Finally, navigate to `http://pocketbase.example.com/_/#/settings/import-collections` and import the [pocketbase-collection.json file](https://raw.githubusercontent.com/helblinglilly/timesheet/refs/heads/main/assets/pocketbase-collection.json)

### SMTP Email (recommended)

To allow for password resets, sign in alerts and Email verifications, populate the SMTP credentials within the Pocketbase UI.

For the sharing and transfering of Timesheets, populate the respective values in your `.env` file as well.

### OAuth providers (optional)

The app is usable without configuring any social providers. Providers will become available as they are populated in Pocketbase. See the documentation for each provider on how to create a client Id and secret.

### Sample docker compose
```yaml
# docker-compose.yaml
services:
  timesheet_pb:
    image: pocketbase:0.29.0
    # Alternatively, if you don't want to build the image yourself
    # image: nxtgencat/pocketbase:0.29.0
    container_name: timesheet_pb
    restart: unless-stopped
    networks:
      - timesheet_network
    volumes:
      - /var/timesheet:/pb/pb_data
    # Only required during initial setup
    ports:
      - "8081:8080"

  timesheet_app:
    ports:
      - "3000:3000"
    image: ghcr.io/helblinglilly/timesheet:main
    container_name: timesheet_app
    pull_policy: always
    restart: unless-stopped
    environment:
      - POCKETBASE_SUPERUSER_EMAIL=See "Pocketbase" step above
      - POCKETBASE_SUPERUSER_PASSWORD=See "Pocketbase" step above
      - NEXT_PUBLIC_HOST=https://timesheet.example.com
      # Optional, but required to send Emails
      - SMTP_HOST=smtp.example.com
      - SMTP_PORT=465
      - SMTP_USER=me@example.com
      - SMTP_PASSWORD=mysupersecurepassword
      - EMAIL_SENDER=admin@timesheet.example.com
      # Do not need to be modified
      - POCKETBASE_URL=http://pb_timesheet:8080
      - NODE_ENV=production
    depends_on:
      timesheet_pb:
    # Optional, if you have watchtower running to keep the image up to date
    labels: { com.centurylinklabs.watchtower.enable: true }
    
networks:
  timesheet_network:
    name: timesheet_network
  driver: bridge
```

To expose this service to the internet, either configure your own proxy like [Caddie](https://caddyserver.com/) or use something like [Cloudflare tunnels](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/). The Pocketbase instance, after setup is complete, will no longer need to be accessible by anyone besides the timesheet_app container.
