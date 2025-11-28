import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, FileText, FileSignature } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface Material {
  id: number;
  title: string;
  type: string;
  size: string;
  url: string;
}

interface ReadingLessonProps {
  duration: number;
  content: string | null;
  transcript: string | null;
  materials: Material[];
}

const ReadingLesson = ({
  duration,
  content,
  transcript,
  materials,
}: ReadingLessonProps) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <>
      {/* READING HEADER */}
      <Card className="mb-4 overflow-hidden shadow-xl border-0">
        <motion.div initial="initial" animate="animate" variants={fadeInUp}>
          <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 relative flex flex-col items-center justify-center px-10 py-12 text-center">
            <div className="bg-white p-5 rounded-2xl shadow-lg mb-4">
              <BookOpen className="w-12 h-12 text-blue-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800">Bài đọc</h2>

            <p className="text-gray-600 mt-2">
              Thời gian đọc ước tính: {duration} phút
            </p>

            <p className="text-gray-500 max-w-2xl mt-6">
              Khi bạn đọc xong, nhấn nút bên dưới.
            </p>
          </div>
        </motion.div>
      </Card>

      {/* CONTENT TABS */}
      <Card className="shadow-xl border-0">
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="materials" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-blue-50 to-purple-50 p-1">
              <TabsTrigger
                value="materials"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                Tài liệu
              </TabsTrigger>

              <TabsTrigger
                value="transcript"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                <FileSignature className="w-4 h-4 mr-2" />
                Nội dung bài đọc
              </TabsTrigger>
            </TabsList>

            {/* MATERIALS TAB */}
            <TabsContent value="materials" className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <FileText className="w-6 h-6 text-blue-600" />
                <span>Tài liệu bài học</span>
              </h3>

              {materials?.length ? (
                <div className="grid grid-cols-1 gap-4">
                  {materials.map((material, index) => (
                    <motion.div
                      key={material.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-5 hover:shadow-lg transition-all hover:scale-105 border-0 bg-gradient-to-br from-white to-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
                              <FileText className="w-6 h-6 text-white" />
                            </div>

                            <div>
                              <h4 className="font-bold text-gray-900">
                                {material.title}
                              </h4>
                              <div className="text-sm text-gray-600 flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  {material.type}
                                </Badge>
                                <span>•</span>
                                <span>{material.size}</span>
                              </div>
                            </div>
                          </div>

                          <Button
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            asChild
                          >
                            <a
                              href={material.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Xem file
                            </a>
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Không có tài liệu nào.</p>
              )}
            </TabsContent>

            {/* TRANSCRIPT TAB */}
            <TabsContent value="transcript" className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <FileSignature className="w-6 h-6 text-purple-600" />
                <span>Nội dung bài đọc</span>
              </h3>

              <Card className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 border-0 shadow-lg">
                <pre className="whitespace-pre-wrap text-gray-800 leading-relaxed font-sans">
                  {content || transcript || 'Không có nội dung.'}
                </pre>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </Card>
    </>
  );
};

export default ReadingLesson;
