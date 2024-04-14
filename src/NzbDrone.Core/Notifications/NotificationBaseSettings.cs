using Equ;
using NzbDrone.Core.ThingiProvider;
using NzbDrone.Core.Validation;

namespace NzbDrone.Core.Notifications
{
    public abstract class NotificationBaseSettings : MemberwiseEquatable<NotificationBaseSettings>, IProviderConfig
    {
        public abstract NzbDroneValidationResult Validate();
    }
}
