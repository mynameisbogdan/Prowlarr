using System;
using System.Collections.Generic;
using System.Text;
using Equ;
using NzbDrone.Core.Datastore;
using NzbDrone.Core.Indexers.Definitions.Cardigann;
using NzbDrone.Core.Profiles;
using NzbDrone.Core.ThingiProvider;

namespace NzbDrone.Core.Indexers
{
    public class IndexerDefinition : ProviderDefinition
    {
        [MemberwiseEqualityIgnore]
        public IEnumerable<string> IndexerUrls { get; set; }

        [MemberwiseEqualityIgnore]
        public IEnumerable<string> LegacyUrls { get; set; }

        public string Description { get; set; }
        public Encoding Encoding { get; set; }
        public string Language { get; set; }

        [MemberwiseEqualityIgnore]
        public DownloadProtocol Protocol { get; set; }

        [MemberwiseEqualityIgnore]
        public IndexerPrivacy Privacy { get; set; }

        [MemberwiseEqualityIgnore]
        public bool SupportsRss { get; set; }

        [MemberwiseEqualityIgnore]
        public bool SupportsSearch { get; set; }

        [MemberwiseEqualityIgnore]
        public bool SupportsRedirect { get; set; }

        [MemberwiseEqualityIgnore]
        public bool SupportsPagination { get; set; }

        [MemberwiseEqualityIgnore]
        public IndexerCapabilities Capabilities { get; set; }

        public int Priority { get; set; } = 25;
        public bool Redirect { get; set; }
        public int DownloadClientId { get; set; }

        [MemberwiseEqualityIgnore]
        public DateTime Added { get; set; }

        public int AppProfileId { get; set; }

        [MemberwiseEqualityIgnore]
        public LazyLoaded<AppSyncProfile> AppProfile { get; set; }

        public List<SettingsField> ExtraFields { get; set; } = new ();
    }
}
