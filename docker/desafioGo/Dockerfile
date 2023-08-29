FROM golang:latest AS builder
WORKDIR /app
COPY . .
RUN GOOS=linux go build -o hello .

FROM scratch
WORKDIR /app
COPY --from=builder /app .
CMD ["./hello"]