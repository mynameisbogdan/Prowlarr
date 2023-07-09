using NzbDrone.Core.IndexerProxies;
using Prowlarr.Http;

namespace Prowlarr.Api.V1.IndexerProxies
{
    [V1ApiController]
    public class IndexerProxyController : ProviderControllerBase<IndexerProxyResource, IndexerProxyBulkResource, IIndexerProxy, IndexerProxyDefinition>
    {
        public static readonly IndexerProxyResourceMapper ResourceMapper = new ();
        public static readonly IndexerProxyBulkResourceMapper BulkResourceMapper = new ();

        public IndexerProxyController(IndexerProxyFactory notificationFactory)
            : base(notificationFactory, "indexerProxy", ResourceMapper, BulkResourceMapper)
        {
        }
    }
}
