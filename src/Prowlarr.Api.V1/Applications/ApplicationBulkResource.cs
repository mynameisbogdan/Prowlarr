using NzbDrone.Core.Applications;

namespace Prowlarr.Api.V1.Applications
{
    public class ApplicationBulkResource : ProviderBulkResource<ApplicationBulkResource>
    {
    }

    public class ApplicationBulkResourceMapper : ProviderBulkResourceMapper<ApplicationBulkResource, ApplicationDefinition>
    {
    }
}
