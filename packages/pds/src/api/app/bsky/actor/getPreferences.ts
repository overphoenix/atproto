import { AppContext } from '../../../../context'
import { Server } from '../../../../lexicon'
import { ids } from '../../../../lexicon/lexicons'

export default function (server: Server, ctx: AppContext) {
  const { bskyAppView } = ctx
  if (!bskyAppView) return

  server.app.bsky.actor.getPreferences({
    auth: ctx.authVerifier.authorization({
      authorize: ({ permissions }) => {
        permissions.assertRpc({
          lxm: ids.AppBskyActorGetPreferences,
          aud: `${bskyAppView.did}#bsky_appview`,
        })
      },
    }),
    handler: async ({ auth }) => {
      const requester = auth.credentials.did

      // @NOTE This is a "hack" that uses a fake lxm to allow for full access
      const fullAccess = auth.credentials.permissions.allowsRpc({
        lxm: `${ids.AppBskyActorGetPreferences}Full`,
        aud: `${bskyAppView.did}#bsky_appview`,
      })

      const preferences = await ctx.actorStore.read(requester, (store) =>
        store.pref.getPreferences('app.bsky', { fullAccess }),
      )
      return {
        encoding: 'application/json',
        body: { preferences },
      }
    },
  })
}
