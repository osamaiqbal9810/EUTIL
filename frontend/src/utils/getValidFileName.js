export const getValidFileName = (name) => {
    return name.replaceAll(' ', '_').replace(/[^A-Za-z0-9_-]/g, "")
}