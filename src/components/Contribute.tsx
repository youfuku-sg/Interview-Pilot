import { Button, Card, CardContent, CardDescription, CardTitle } from "./ui";

const Contribute = () => {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col gap-4 p-4 py-0 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2 md:max-w-[70%]">
          <CardTitle className="text-xs lg:text-sm">
            Pluelyに貢献して永久ライセンスを獲得
          </CardTitle>
          <CardDescription className="text-[10px] lg:text-xs">
            掲載されている重大な issue を修正すると、$120 相当の永久 Dev
            Pro ライセンスを獲得できます。対象は contribute
            ページに掲載されている issue のみです。詳細は
            pluely.com/contribute をご覧ください
          </CardDescription>
        </div>
        <Button asChild className="w-full md:w-auto text-[10px] lg:text-xs">
          <a
            href="https://pluely.com/contribute"
            rel="noopener noreferrer"
            target="_blank"
          >
            pluely.com/contribute
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default Contribute;
