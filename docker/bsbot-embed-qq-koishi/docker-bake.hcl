variable "REGISTRY" {
  default = "ghcr.io"
}
variable "USERNAME" {
  default = "kt-fun"
}
variable "REPO" {
  default = "beatsaber-bot"
}
variable "TAG" {
  default = "latest"
}

group "default" {
  targets = [
    "beatsaber-bot-qq"
  ]
}
target "beatsaber-bot-qq" {
  # name = "beatsaber-bot-qq"
  context    = "./docker/bsbot-embed-qq-koishi"
  dockerfile = "Dockerfile"
  platforms  = ["linux/amd64", "linux/arm64"]
  args = {
    NAPCAT_VERSION = "v4.8.105"
  }
  tags = ["${REGISTRY}/${USERNAME}/${REPO}:${TAG}"]
}
