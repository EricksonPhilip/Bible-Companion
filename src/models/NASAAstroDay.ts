
/**
 * Response item returned by NASA's Astronomy Picture of the Day endpoint.
 *
 * Endpoint:
 * https://science.nasa.gov/wp-json/wp/v2/apod-basic
 */
export interface NASAAstroDay {
  /** APOD date in YYYY-MM-DD format. */
  date: string;

  /** WordPress post ID for the APOD entry. */
  post_id: number;

  title: string;
  explanation: string;
  media_type: 'image' | 'video' | 'iframe' | string;

  /** APOD article URL. */
  url: string;
  permalink: string;

  /** Full-size featured image URL, when available. */
  hdurl?: string;

  /** Image/video accessibility description. */
  alt?: string;

  /** Credit and copyright information, when provided. */
  credit?: string;
  copyright?: string;

  /** NASA's rendered APOD HTML and its plain-text source URL. */
  basic_html?: string;
  basic_html_url?: string;
}

/**
 * A single APOD request returns one item. A request using `count` returns an
 * array of items.
 */
export type NASAAstroDayResponse = NASAAstroDay | NASAAstroDay[];

export interface NASAAstroDayQuery {
  /** YYYY-MM-DD. Cannot be combined with start_date/end_date or count. */
  date?: string;

  /** YYYY-MM-DD range start. */
  start_date?: string;

  /** YYYY-MM-DD range end. */
  end_date?: string;

  /** Random item count; NASA allows up to 25. */
  count?: number;

  api_key?: string;
}
