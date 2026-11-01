using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace NzbDrone.Core.Indexers.Definitions.HDBits
{
    public class TorrentQuery
    {
        public string Username { get; set; }
        public string Passkey { get; set; }
        public string Search { get; set; }
        public IEnumerable<int> Category { get; set; }
        public IEnumerable<int> Codec { get; set; }
        public IEnumerable<int> Medium { get; set; }
        public IEnumerable<int> Origin { get; set; }

        [JsonPropertyName("imdb")]
        public ImdbInfo ImdbInfo { get; set; }

        [JsonPropertyName("tvdb")]
        public TvdbInfo TvdbInfo { get; set; }

        [JsonPropertyName("file_in_torrent")]
        public string FileInTorrent { get; set; }

        [JsonPropertyName("snatched_only")]
        public bool? SnatchedOnly { get; set; }

        public int? Limit { get; set; }
        public int? Page { get; set; }
    }

    public class HDBitsResponse
    {
        [JsonRequired]
        public StatusCode Status { get; set; }
        public string Message { get; set; }
        public object Data { get; set; }
    }

    public class TorrentQueryResponse
    {
        public long Id { get; set; }

        public string Hash { get; set; }
        public int Leechers { get; set; }
        public int Seeders { get; set; }
        public string Name { get; set; }

        [JsonPropertyName("times_completed")]
        public uint TimesCompleted { get; set; }

        public long Size { get; set; }
        public DateTime Added { get; set; }

        [JsonPropertyName("numfiles")]
        public uint NumFiles { get; set; }

        [JsonPropertyName("filename")]
        public string FileName { get; set; }

        [JsonPropertyName("freeleech")]
        public string FreeLeech { get; set; }

        [JsonPropertyName("type_category")]
        public int TypeCategory { get; set; }

        [JsonPropertyName("type_codec")]
        public int TypeCodec { get; set; }

        [JsonPropertyName("type_medium")]
        public int TypeMedium { get; set; }

        [JsonPropertyName("type_origin")]
        public int TypeOrigin { get; set; }

        [JsonPropertyName("type_exclusive")]
        public int TypeExclusive { get; set; }

        [JsonPropertyName("imdb")]
        public ImdbInfo ImdbInfo { get; set; }

        [JsonPropertyName("tvdb")]
        public TvdbInfo TvdbInfo { get; set; }
    }

    public class ImdbInfo
    {
        public int? Id { get; set; }
        public string EnglishTitle { get; set; }
        public string OriginalTitle { get; set; }
        public int? Year { get; set; }
        public IReadOnlyCollection<string> Genres { get; set; }
        public float? Rating { get; set; }
    }

    public class TvdbInfo
    {
        public int? Id { get; set; }
        public int? Season { get; set; }
        public int? Episode { get; set; }
    }

    public enum StatusCode
    {
        Success = 0,
        Failure = 1,
        SslRequired = 2,
        JsonMalformed = 3,
        AuthDataMissing = 4,
        AuthFailed = 5,
        MissingRequiredParameters = 6,
        InvalidParameter = 7,
        ImdbImportFail = 8,
        ImdbTvNotAllowed = 9
    }
}
