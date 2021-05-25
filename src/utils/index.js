const { shell } = window.require("electron")

export const openExternal = (url) => {
    shell.openExternal(url)
}

export const IsNum = value => {
    return !isNaN(value)
}