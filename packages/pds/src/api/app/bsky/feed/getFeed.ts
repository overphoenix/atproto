import { InvalidRequestError } from '@atproto/oauth-provider'
import { AtUri } from '@atproto/syntax'
import { AppContext } from '../../../../context'
import { Server } from '../../../../lexicon'
import { ids } from '../../../../lexicon/lexicons'
import { pipethrough } from '../../../../pipethrough'

export default function (server: Server, ctx: AppContext) {
  const { bskyAppView } = ctx
  if (!bskyAppView) return

  server.app.bsky.feed.getFeed({
    auth: ctx.authVerifier.authorization({
      authorize: ({ permissions }) => {
        // @NOTE We don't need to check for "com.atproto.repo.getRecord" here
        // because that request is not made using the user's credentials.

        permissions.assertRpc({
          lxm: ids.AppBskyFeedGetFeed,
          aud: `${bskyAppView.did}#bsky_appview`,
        })
      },
    }),
    handler: async ({ params, auth, req }) => {
      const requester = auth.credentials.did

      const feedUrl = new AtUri(params.feed)
      const { data } = await bskyAppView.agent.com.atproto.repo.getRecord({
        repo: feedUrl.hostname,
        collection: feedUrl.collection,
        rkey: feedUrl.rkey,
      })
      const feedDid = data.value['did']
      if (typeof feedDid !== 'string') {
        throw new InvalidRequestError(
          'could not resolve feed did',
          'UnknownFeed',
        )
      }

      return pipethrough(ctx, req, {
        iss: requester,
        aud: feedDid,
        lxm: ids.AppBskyFeedGetFeedSkeleton,
      })
    },
  })
}
