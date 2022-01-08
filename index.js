import express from "express";
import cheerio from "cheerio";
import axios from "axios";

const PORT = process.env.PORT || 5000;
const URL = "https://yabancidizi.pw/";

const app = express();

const recentlyAddedMovies = [];

app.get("/", (req, res) => {
  res.json("Hi!");
});

app.get("/recentlyAddedMovies", (req, res) => {
  axios.get(URL).then((axiosResponse) => {
    const $ = cheerio.load(axiosResponse.data);

    $(".flex.flex-wrap.flex-home .mofy-movbox").each(function (index, element) {
      const imgSrc =
        URL +
        $(element)
          .children(".mofy-movbox-image")
          .children("a")
          .children("img")
          .attr("data-src");
      const rate = $(element)
        .children(".mofy-movbox-image")
        .children("a")
        .children(".mofy-movbox-on")
        .children(".mofy-movpoint")
        .children("span")
        .text()
        .trim();
      const name = $(element)
        .children(".mofy-movbox-text")
        .children("span")
        .children("a")
        .text()
        .trim();
      const movieUrl =
        URL +
        $(element)
          .children(".mofy-movbox-text")
          .children("span")
          .children("a")
          .attr("href");
      const genre = $(element)
        .children(".mofy-movbox-text")
        .children("p")
        .text()
        .trim();

      recentlyAddedMovies.push({
        imgSrc,
        rate,
        name,
        movieUrl,
        genre,
      });
    });
    res.json(recentlyAddedMovies);
  });
});

app.listen(PORT, () => {
  console.log("Server running on port: " + PORT);
});
