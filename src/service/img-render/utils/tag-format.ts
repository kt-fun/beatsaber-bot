export const getTag =(slug:string) => {
  return tags[slug].value??slug
}


const tags: Record<string,{
  type: string,
  value: string,
  slug: string
}> = {
  "tech": {
    type: 'Style',
    value: 'Tech',
    slug: 'tech'
  },
  "dance-style": {
    type: 'Style',
    value: 'Dance',
    slug: 'dance-style'
  },
  "speed": {
    type: 'Style',
    value: 'Speed',
    slug: 'speed'
  },
  "balanced": {
    type: 'Style',
    value: 'Balanced',
    slug: 'balanced'
  },
  "challenge": {
    type: 'Style',
    value: 'Challenge',
    slug: 'challenge'
  },
  "accuracy": {
    type: 'Style',
    value: 'Accuracy',
    slug: 'accuracy'
  },
  "fitness": {
    type: 'Style',
    value: 'Fitness',
    slug: 'fitness'
  },

  "k-pop": {
    type: 'Genre',
    value: 'K-Pop',
    slug: 'k-pop'
  },
  "swing": {
    type: 'Genre',
    value: 'Swing',
    slug: 'swing'
  },
  "nightcore": {
    type: 'Genre',
    value: 'Nightcore',
    slug: 'nightcore'
  },
  "folk-acoustic": {
    type: 'Genre',
    value: 'Folk & Acoustic',
    slug: 'folk-acoustic'
  },
  "kids-family": {
    type: 'Genre',
    value: 'Kids & Family',
    slug: 'kids-family'
  },
  "ambient": {
    type: 'Genre',
    value: 'Ambient',
    slug: 'ambient'
  },
  "funk-disco": {
    type: 'Genre',
    value: 'Funk & Disco',
    slug: 'funk-disco'
  },
  "jazz": {
    type: 'Genre',
    value: 'Jazz',
    slug: 'jazz'
  },
  "classical-orchestral": {
    type: 'Genre',
    value: 'Classical & Orchestral',
    slug: 'classical-orchestral'
  },
  "soul": {
    type: 'Genre',
    value: 'Soul',
    slug: 'soul'
  },
  "speedcore": {
    type: 'Genre',
    value: 'Speedcore',
    slug: 'speedcore'
  },
  "punk": {
    type: 'Genre',
    value: 'Punk',
    slug: 'punk'
  },
  "rb": {
    type: 'Genre',
    value: 'R&B',
    slug: 'rb'
  },
  "holiday": {
    type: 'Genre',
    value: 'Holiday',
    slug: 'holiday'
  },
  "vocaloid": {
    type: 'Genre',
    value: 'Vocaloid',
    slug: 'vocaloid'
  },
  "j-rock": {
    type: 'Genre',
    value: 'J-Rock',
    slug: 'j-rock'
  },
  "trance": {
    type: 'Genre',
    value: 'Trance',
    slug: 'trance'
  },
  "drum-and-bass": {
    type: 'Genre',
    value: 'Drum and Bass',
    slug: 'drum-and-bass'
  },
  "comedy-meme": {
    type: 'Genre',
    value: 'Comedy & Meme',
    slug: 'comedy-meme'
  },
  "instrumental": {
    type: 'Genre',
    value: 'Instrumental',
    slug: 'instrumental'
  },
  "hardcore": {
    type: 'Genre',
    value: 'Hardcore',
    slug: 'hardcore'
  },
  "indie": {
    type: 'Genre',
    value: 'Indie',
    slug: 'indie'
  },
  "techno": {
    type: 'Genre',
    value: 'Techno',
    slug: 'techno'
  },
  "house": {
    type: 'Genre',
    value: 'House',
    slug: 'house'
  },
  "video-game-soundtrack": {
    type: 'Genre',
    value: 'Video Game',
    slug: 'video-game-soundtrack'
  },
  "tv-movie-soundtrack": {
    type: 'Genre',
    value: 'TV & Film',
    slug: 'tv-movie-soundtrack'
  },
  "alternative": {
    type: 'Genre',
    value: 'Alternative',
    slug: 'alternative'
  },
  "dubstep": {
    type: 'Genre',
    value: 'Dubstep',
    slug: 'dubstep'
  },
  "metal": {
    type: 'Genre',
    value: 'Metal',
    slug: 'metal'
  },
  "anime": {
    type: 'Genre',
    value: 'Anime',
    slug: 'anime'
  },
  "hip-hop-rap": {
    type: 'Genre',
    value: 'Hip Hop & Rap',
    slug: 'hip-hop-rap'
  },
  "j-pop": {
    type: 'Genre',
    value: 'J-Pop',
    slug: 'j-pop'
  },
  "dance": {
    type: 'Genre',
    value: 'Dance',
    slug: 'dance'
  },
  "rock": {
    type: 'Genre',
    value: 'Rock',
    slug: 'rock'
  },
  "pop": {
    type: 'Genre',
    value: 'Pop',
    slug: 'pop'
  },
  "electronic": {
    type: 'Genre',
    value: 'Electronic',
    slug: 'electronic'
  }
}
