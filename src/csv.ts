import Papa from "papaparse";
import { ObrError } from "./errors";
import { Track } from "./track";

interface Row {
  title: string;
  url: string;
  tags: string;
}

const tagDelimiter = "|";

const options = { delimiter: ",", header: true, skipEmptyLines: true };

export function csvToTracks(text: string): Track[] {
  const results = Papa.parse<Row>(text, options);
  if (results.errors.length != 0) {
    throw new ObrError("CsvError", results.errors);
  }
  return results.data.map((r) => ({
    title: r.title,
    url: r.url,
    tags: r.tags.split(tagDelimiter),
  }));
}

export function TracksToCsv(tracks: Track[]): string {
  return Papa.unparse<Row>(
    tracks.map<Row>((r) => ({
      title: r.title,
      url: r.url,
      tags: r.tags.join(tagDelimiter),
    })),
    options,
  );
}
