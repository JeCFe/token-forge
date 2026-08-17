const prereleaseBranch = process.env.RELEASE_BRANCH;
const prereleaseChannel = process.env.RELEASE_CHANNEL;
const isStableRelease = process.env.RELEASE_MODE === 'stable';

const plugins = [
  '@semantic-release/commit-analyzer',
  '@semantic-release/release-notes-generator',
  [
    '@semantic-release/npm',
    {
      npmPublish: true,
    },
  ],
];

if (isStableRelease) {
  plugins.push(
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    '@semantic-release/github',
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json', 'package-lock.json'],
        message: 'chore(release): ${nextRelease.version} [skip ci]',
      },
    ],
  );
}

export default {
  branches: [
    'main',
    ...(prereleaseBranch && prereleaseChannel
      ? [{ name: prereleaseBranch, prerelease: prereleaseChannel }]
      : []),
  ],
  plugins,
};
