import json
from dataclasses import dataclass, asdict
from typing import List, Dict

@dataclass
class Movie:
    id: str
    title: str
    year: int
    cast: List[str]
    genres: List[str]

@dataclass
class Actor:
    id: str
    name: str
    present_in: List[str]

@dataclass
class Genre:
    id: str
    name: str
    movies: List[str]

def main():
    movies = []
    actors = {}
    genres = {}
    
    with open("filmes.json", "r", encoding="utf-8") as file:
        for line in file:
            data = json.loads(line)
            movie_id = data["_id"]["$oid"]
            movie_actors = []
            movie_genres = []

            for actor in data["cast"]:
                if actor not in actors:
                    actors[actor] = Actor(str(len(actors)), actor, [movie_id])
                else:
                    actors[actor].present_in.append(movie_id)
                movie_actors.append(actors[actor].id)

            for genre in data.get("genres", []):
                if genre not in genres:
                    genres[genre] = Genre(str(len(genres)), genre, [movie_id])
                else:
                    genres[genre].movies.append(movie_id)
                movie_genres.append(genres[genre].id)

            movies.append(Movie(movie_id, data["title"], data["year"], movie_actors, movie_genres))

    with open("filmes-final.json", "w", encoding="utf-8") as file:
        json.dump({
            "movies": [asdict(movie) for movie in movies],
            "actors": [asdict(actor) for actor in actors.values()],
            "genres": [asdict(genre) for genre in genres.values()]
        }, file, indent=4)

if __name__ == "__main__":
    main()
