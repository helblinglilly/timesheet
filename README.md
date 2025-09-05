# Timesheet

## Get started

```sh
npm i
cp .env.example .env

# Populate POCKETBASE_URL in the .env file
npm run dev
```

## Deploy

This app creates a standalone Docker image for a NextJS app which can be self-hosted.

The app relies on a Pocketbase instance. You can [build your own Docker image following their instructions](https://pocketbase.io/docs/going-to-production/#using-docker) or use a pre-made one by the community.

```yaml
# docker-compose.yaml
services:
  timesheet_pb:
    image: pocketbase:0.29.0
    # Alternatively, if you don't want to build the image yourself
    # image: nxtgencat/pocketbase:0.29.0
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
      - POCKETBASE_URL=http://localhost:8080
    depends_on:
      timesheet_pb:
    # Optional, if you have watchtower running to keep the image up to date
    labels: { com.centurylinklabs.watchtower.enable: true }
```

To expose this service to the internet, either configure your own proxy like [Caddie](https://caddyserver.com/) or use something like [Cloudflare tunnels](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
