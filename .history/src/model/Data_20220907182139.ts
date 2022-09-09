export interface Data {
  data: string;
  err: Err;
}

export interface Err {
  Stderr: null;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toData(json: string): Data {
    return JSON.parse(json);
  }

  public static dataToJson(value: Data): string {
    return JSON.stringify(value);
  }
}
