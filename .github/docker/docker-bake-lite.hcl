group "default" {
  targets = ["koishi-beatsaber-bot-lite"]
}

target "docker-metadata-action" {}

target "koishi-beatsaber-bot-lite" {
  inherits = ["docker-metadata-action"]
  context = "./.github"
  dockerfile = "docker/lite.Dockerfile"
  platforms = [
    "linux/amd64",
    "linux/arm64",
  ]
}
