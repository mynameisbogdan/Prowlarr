using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml.Linq;
using NLog;
using NzbDrone.Common.Extensions;
using NzbDrone.Common.Http;
using NzbDrone.Core.Configuration;
using NzbDrone.Core.Indexers.Settings;
using NzbDrone.Core.IndexerSearch.Definitions;
using NzbDrone.Core.Messaging.Events;
using NzbDrone.Core.Parser;
using NzbDrone.Core.Parser.Model;

namespace NzbDrone.Core.Indexers.Definitions;

public class Nyaa : TorrentIndexerBase<NoAuthTorrentBaseSettings>
{
    public override string Name => "Nyaa";
    public override string[] IndexerUrls => new[]
    {
        "https://nyaa.si/",
        "https://nyaa.iss.ink/",
        "https://nyaa.mrunblock.guru/", // for magnets only
        "https://nyaa.unblockninja.com/" // for magnets only
    };
    public override string Description => "Nyaa is a Public torrent site focused on Eastern Asian media including anime, manga, literature and music";
    public override string Language => "en-US";
    public override Encoding Encoding => Encoding.UTF8;
    public override DownloadProtocol Protocol => DownloadProtocol.Torrent;
    public override IndexerPrivacy Privacy => IndexerPrivacy.Public;
    public override int PageSize => 100;
    public override IndexerCapabilities Capabilities => SetCapabilities();
    public override TimeSpan RateLimit => TimeSpan.FromSeconds(3);

    public Nyaa(IIndexerHttpClient httpClient, IEventAggregator eventAggregator, IIndexerStatusService indexerStatusService, IConfigService configService, Logger logger)
        : base(httpClient, eventAggregator, indexerStatusService, configService, logger)
    {
    }

    public override IIndexerRequestGenerator GetRequestGenerator()
    {
        return new NyaaRequestGenerator(Settings, Capabilities);
    }

    public override IParseIndexerResponse GetParser()
    {
        return new NyaaParser(Settings, Capabilities.Categories)
        {
            UseGuidInfoUrl = true,
            SizeElementName = "size",
            InfoHashElementName = "infoHash",
            PeersElementName = "leechers",
            CalculatePeersAsSum = true,
            SeedsElementName = "seeders"
        };
    }

    private IndexerCapabilities SetCapabilities()
    {
        var caps = new IndexerCapabilities
        {
            TvSearchParams = new List<TvSearchParam>
            {
                TvSearchParam.Q, TvSearchParam.Season, TvSearchParam.Ep
            },
            MovieSearchParams = new List<MovieSearchParam>
            {
                MovieSearchParam.Q
            },
            BookSearchParams = new List<BookSearchParam>
            {
                BookSearchParam.Q
            },
            SupportsRawSearch = true
        };

        // Anime
        caps.Categories.AddCategoryMapping("1_0", NewznabStandardCategory.TVAnime, "Anime");
        caps.Categories.AddCategoryMapping("1_1", NewznabStandardCategory.TVAnime, "Anime music videos");
        caps.Categories.AddCategoryMapping("1_2", NewznabStandardCategory.TVAnime, "English subtitled animes");
        caps.Categories.AddCategoryMapping("1_3", NewznabStandardCategory.TVAnime, "Non-english subtitled animes");
        caps.Categories.AddCategoryMapping("1_4", NewznabStandardCategory.TVAnime, "Raw animes");

        // Anime as Movies (Radarr uses t=movie):
        caps.Categories.AddCategoryMapping("1_0", NewznabStandardCategory.MoviesOther, "Anime");
        caps.Categories.AddCategoryMapping("1_1", NewznabStandardCategory.MoviesOther, "Anime music videos");
        caps.Categories.AddCategoryMapping("1_2", NewznabStandardCategory.MoviesOther, "English subtitled animes");
        caps.Categories.AddCategoryMapping("1_3", NewznabStandardCategory.MoviesOther, "Non-english subtitled animes");
        caps.Categories.AddCategoryMapping("1_4", NewznabStandardCategory.MoviesOther, "Raw animes");

        // Audio
        caps.Categories.AddCategoryMapping("2_0", NewznabStandardCategory.Audio, "Audio");
        caps.Categories.AddCategoryMapping("2_1", NewznabStandardCategory.Audio, "Lossless audio");
        caps.Categories.AddCategoryMapping("2_2", NewznabStandardCategory.Audio, "Lossy audio");

        // Literature
        caps.Categories.AddCategoryMapping("3_0", NewznabStandardCategory.Books, "Literature");
        caps.Categories.AddCategoryMapping("3_1", NewznabStandardCategory.Books, "Literature english translated");
        caps.Categories.AddCategoryMapping("3_2", NewznabStandardCategory.Books, "Literature non-english translated");
        caps.Categories.AddCategoryMapping("3_3", NewznabStandardCategory.Books, "Raw literature");

        // Live
        caps.Categories.AddCategoryMapping("4_0", NewznabStandardCategory.TVOther, "Live Action");
        caps.Categories.AddCategoryMapping("4_1", NewznabStandardCategory.TVOther, "Live Action - English");
        caps.Categories.AddCategoryMapping("4_2", NewznabStandardCategory.TVOther, "Live Action - Idol/PV");
        caps.Categories.AddCategoryMapping("4_3", NewznabStandardCategory.TVOther, "Live Action - Non-English");
        caps.Categories.AddCategoryMapping("4_4", NewznabStandardCategory.TVOther, "Live Action - Raw");

        // Pics
        caps.Categories.AddCategoryMapping("5_0", NewznabStandardCategory.Other, "Pictures");
        caps.Categories.AddCategoryMapping("5_1", NewznabStandardCategory.Other, "Pictures  - Graphics");
        caps.Categories.AddCategoryMapping("5_2", NewznabStandardCategory.Other, "Pictures  - Photos");

        // Software
        caps.Categories.AddCategoryMapping("6_0", NewznabStandardCategory.PC, "Software");
        caps.Categories.AddCategoryMapping("6_1", NewznabStandardCategory.PCISO, "Applications");
        caps.Categories.AddCategoryMapping("6_2", NewznabStandardCategory.PCGames, "Games");

        return caps;
    }
}

public class NyaaRequestGenerator : IIndexerRequestGenerator
{
    private readonly NoAuthTorrentBaseSettings _settings;
    private readonly IndexerCapabilities _capabilities;

    public NyaaRequestGenerator(NoAuthTorrentBaseSettings settings, IndexerCapabilities capabilities)
    {
        _settings = settings;
        _capabilities = capabilities;
    }

    public IndexerPageableRequestChain GetSearchRequests(MovieSearchCriteria searchCriteria)
    {
        var pageableRequests = new IndexerPageableRequestChain();

        pageableRequests.Add(GetPagedRequests(searchCriteria.SanitizedSearchTerm, searchCriteria));

        return pageableRequests;
    }

    public IndexerPageableRequestChain GetSearchRequests(MusicSearchCriteria searchCriteria)
    {
        var pageableRequests = new IndexerPageableRequestChain();

        pageableRequests.Add(GetPagedRequests(searchCriteria.SanitizedSearchTerm, searchCriteria));

        return pageableRequests;
    }

    public IndexerPageableRequestChain GetSearchRequests(TvSearchCriteria searchCriteria)
    {
        var pageableRequests = new IndexerPageableRequestChain();

        pageableRequests.Add(GetPagedRequests(searchCriteria.SanitizedTvSearchString, searchCriteria));
        pageableRequests.Add(GetPagedRequests(searchCriteria.SanitizedSearchTerm, searchCriteria));

        return pageableRequests;
    }

    public IndexerPageableRequestChain GetSearchRequests(BookSearchCriteria searchCriteria)
    {
        return new IndexerPageableRequestChain();
    }

    public IndexerPageableRequestChain GetSearchRequests(BasicSearchCriteria searchCriteria)
    {
        var pageableRequests = new IndexerPageableRequestChain();

        pageableRequests.Add(GetPagedRequests(searchCriteria.SanitizedSearchTerm, searchCriteria));

        return pageableRequests;
    }

    private IEnumerable<IndexerRequest> GetPagedRequests(string term, SearchCriteriaBase searchCriteria)
    {
        var parameters = new NameValueCollection
        {
            { "cats", "1_0" }
        };

        if (term.IsNotNullOrWhiteSpace())
        {
            parameters.Set("term", term.Trim());
        }

        var searchUrl = $"{_settings.BaseUrl.TrimEnd('/')}/rss?{parameters.GetQueryString()}";

        yield return new IndexerRequest(searchUrl, HttpAccept.Rss);
    }

    public Func<IDictionary<string, string>> GetCookies { get; set; }
    public Action<IDictionary<string, string>, DateTime?> CookiesUpdater { get; set; }
}

public class NyaaParser : TorrentRssParser
{
    private readonly NoAuthTorrentBaseSettings _settings;
    private readonly IndexerCapabilitiesCategories _categories;

    public NyaaParser(NoAuthTorrentBaseSettings settings, IndexerCapabilitiesCategories categories)
    {
        _settings = settings;
        _categories = categories;
    }

    protected override ReleaseInfo ProcessItem(XElement item, ReleaseInfo releaseInfo)
    {
        var result = base.ProcessItem(item, releaseInfo) as TorrentInfo;

        result.Grabs = GetGrabs(item);

        return result;
    }

    protected override string GetTitle(XElement item)
    {
        return ParseTitle(base.GetTitle(item));
    }

    protected override ICollection<IndexerCategory> GetCategory(XElement item)
    {
        return _categories.MapTrackerCatToNewznab(item.FindDecendants("categoryId").SingleOrDefault()?.Value ?? string.Empty);
    }

    protected virtual int? GetGrabs(XElement item)
    {
        if (int.TryParse(item.FindDecendants("downloads").SingleOrDefault()?.Value, out var grabs))
        {
            return grabs;
        }

        return null;
    }

    private static string ParseTitle(string title)
    {
        title = title.Replace('_', ' ');

        title = Regex.Replace(title, @"\b(\d+)(st|nd|rd|th) Season\b", n => $"S{n.Groups[1].Value.PadLeft(2, '0')}", RegexOptions.Compiled | RegexOptions.IgnoreCase);
        title = Regex.Replace(title, @"\bSeason (\d+)\b", n => $"S{n.Groups[1].Value.PadLeft(2, '0')}", RegexOptions.Compiled | RegexOptions.IgnoreCase);

        title = Regex.Replace(title, @"\b(I{2,}) - (\d+)[\s\-~\+àa&]+(\d+)\b", n => $"{n.Groups[1].Value} - S{n.Groups[1].Length.ToString().PadLeft(2, '0')}E{n.Groups[2].Value.PadLeft(2, '0')}-E{n.Groups[3].Value.PadLeft(2, '0')} - {n.Groups[2].Value.PadLeft(2, '0')}-{n.Groups[3].Value.PadLeft(2, '0')}", RegexOptions.Compiled);
        title = Regex.Replace(title, @"\b(I{2,}) - (\d+)\b", n => $"{n.Groups[1].Value} - S{n.Groups[1].Length.ToString().PadLeft(2, '0')} - {n.Groups[2].Value.PadLeft(2, '0')}", RegexOptions.Compiled);

        title = Regex.Replace(title, @"\bSeasons (\d+)\-(\d+)\b", n => $"S{n.Groups[1].Value.PadLeft(2, '0')}-{n.Groups[2].Value.PadLeft(2, '0')}", RegexOptions.Compiled | RegexOptions.IgnoreCase);

        return title.Trim();
    }
}
