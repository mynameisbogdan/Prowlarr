using System;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using NzbDrone.Core.IndexerSearch.Definitions;
using NzbDrone.Core.ThingiProvider;

namespace NzbDrone.Core.Indexers
{
    public interface IIndexer : IProvider
    {
        bool SupportsRss { get; }
        bool SupportsSearch { get; }
        bool SupportsRedirect { get; }
        bool SupportsPagination { get; }
        IndexerCapabilities Capabilities { get; }

        string[] IndexerUrls { get; }
        string[] LegacyUrls { get; }
        string Description { get; }
        Encoding Encoding { get; }
        string Language { get; }
        DownloadProtocol Protocol { get; }
        IndexerPrivacy Privacy { get; }

        Task<IndexerPageableQueryResult> Fetch(MovieSearchCriteria searchCriteria, CancellationToken cancellationToken = default);
        Task<IndexerPageableQueryResult> Fetch(MusicSearchCriteria searchCriteria, CancellationToken cancellationToken = default);
        Task<IndexerPageableQueryResult> Fetch(TvSearchCriteria searchCriteria, CancellationToken cancellationToken = default);
        Task<IndexerPageableQueryResult> Fetch(BookSearchCriteria searchCriteria, CancellationToken cancellationToken = default);
        Task<IndexerPageableQueryResult> Fetch(BasicSearchCriteria searchCriteria, CancellationToken cancellationToken = default);

        Task<IndexerDownloadResponse> Download(Uri link, CancellationToken cancellationToken = default);
        bool IsObsolete();

        IndexerCapabilities GetCapabilities();
    }
}
