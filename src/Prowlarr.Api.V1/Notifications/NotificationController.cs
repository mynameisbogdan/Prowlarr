using NzbDrone.Core.Notifications;
using Prowlarr.Http;

namespace Prowlarr.Api.V1.Notifications
{
    [V1ApiController]
    public class NotificationController : ProviderControllerBase<NotificationResource, NotificationBulkResource, INotification, NotificationDefinition>
    {
        public static readonly NotificationResourceMapper ResourceMapper = new ();
        public static readonly NotificationBulkResourceMapper BulkResourceMapper = new ();

        public NotificationController(NotificationFactory notificationFactory)
            : base(notificationFactory, "notification", ResourceMapper, BulkResourceMapper)
        {
        }
    }
}
