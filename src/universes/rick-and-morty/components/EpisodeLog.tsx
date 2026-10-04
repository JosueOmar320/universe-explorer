import type { Episode } from '../api/types';
import { groupEpisodesBySeason } from '../utils/episodes';
import styles from './EpisodeLog.module.css';

export function EpisodeLog({ episodes }: { episodes: Episode[] }) {
  return (
    <div className={styles.seasons}>
      {groupEpisodesBySeason(episodes).map((season) => (
        <section key={season.number} aria-labelledby={`rm-season-${season.number}`}>
          <h3 id={`rm-season-${season.number}`} className={styles.seasonTitle}>
            {season.number > 0 ? `Season ${season.number}` : 'Other'}
            <span className={styles.count}>
              {season.episodes.length} {season.episodes.length === 1 ? 'episode' : 'episodes'}
            </span>
          </h3>
          <ol className={styles.episodes}>
            {season.episodes.map((episode) => (
              <li key={episode.id} className={styles.episode}>
                <span className={styles.code}>{episode.episode}</span>
                <span className={styles.episodeName}>{episode.name}</span>
                <span className={styles.airDate}>{episode.air_date}</span>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
