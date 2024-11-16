variable "TAG" {}

group "default" {
  targets = ["koishi-beatsaber-bot"]
}

target "docker-metadata-action" {}

target "koishi-beatsaber-bot" {
  inherits = ["docker-metadata-action"]
  context = "./github"
  dockerfile = ".github/docker/Dockerfile"
  platforms = [
    "linux/amd64",
    "linux/arm64",
  ]
}

target "koishi-beatsaber-bot-lite" {
  inherits = ["docker-metadata-action"]
  context = "./github"
  dockerfile = ".github/docker/lite.Dockerfile"
  platforms = [
    "linux/amd64",
    "linux/arm64",
  ]
  args = {
    VERSION = "${TAG}",
  }
}
