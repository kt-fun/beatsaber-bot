variable "REGISTRY" {
  default = "ghcr.io"
}
variable "USERNAME" {
  default = "ktkongtong"
}
variable "REPO" {
  default = "beatsaber-bot"
}
variable "TAG" {
  default = "latest"
}

target "bsbot-qq" {
  matrix = {
    arch = ["amd64", "arm64"]
  }
  context    = "."
  dockerfile = "Dockerfile"
  platforms  = ["linux/${matrix.arch}"]
  args = {
    NODE_VERSION = "20"
    LINUX_QQ_DOWNLOAD_URL = "https://dldir1v6.qq.com/qqfile/qq/QQNT/c773cdf7/linuxqq_3.2.19-39038_${matrix.arch}.deb"
    NAPCAT_VERSION = "v4.8.105"
    KOISHI_BOILERPLATE_URL = "https://github.com/koishijs/boilerplate/releases/download/v1.15.0/boilerplate-v1.15.0-linux-${matrix.arch == "amd64" ? "x64" : "arm64"}-node20.zip"
  }
  // A single tag for all architectures. Docker will create a manifest list.
  tags = ["${var.REGISTRY}/${var.USERNAME}/${var.REPO}-qq:${var.TAG}"]
}
