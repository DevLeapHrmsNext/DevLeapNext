declare module "xls-to-json-lc" {
    interface XlsToJsonOptions {
      input: string;
      output?: string;
      sheet?: string;
    }
  
    type XlsToJsonCallback = (err: Error | null, result: any[]) => void;
  
    function xlsToJson(options: XlsToJsonOptions, callback: XlsToJsonCallback): void;
  
    export default xlsToJson;
  }
  