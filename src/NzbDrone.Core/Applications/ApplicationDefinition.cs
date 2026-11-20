using NzbDrone.Core.ThingiProvider;

namespace NzbDrone.Core.Applications
{
    public class ApplicationDefinition : ProviderDefinition
    {
        public ApplicationSyncLevel SyncLevel { get; set; }

        public ApplicationType ApplicationType { get; set; }

        public override bool Enable => SyncLevel is ApplicationSyncLevel.AddOnly or ApplicationSyncLevel.FullSync;
    }
}
