import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/home/Home";
import Favorites from "../pages/favorites/Favorites";
import Lists from "../pages/lists/Lists";
import ListPage from "../pages/lists/list-page/ListPage";
import Anime from "../pages/home/anime/Anime";

const MainRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lists" element={<Lists />} />
        <Route path="/lists/:listId" element={<ListPage />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/:animeId" element={<Anime />} />
      </Routes>
    </BrowserRouter>
  );
};

export default MainRouter;
