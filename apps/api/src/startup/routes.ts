import { Application } from "express"
import scrape from "routes/scrape"

export const routes = (app: Application) => {
    app.use("/scrape", scrape)
}
