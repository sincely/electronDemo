const dev = process.env.NODE_ENV !== 'production'

// 暂无
export const BASE_URL = dev ? '开发地址' : '生产地址'

// gitlab api前缀
export const GITLAB_URL = "http://gitlab.devops.guchele.com/api/v4"

// gitlab 私人token
export const PRIVATE_TOKEN = "xpJur6ERHGXDkMnzaxZG"