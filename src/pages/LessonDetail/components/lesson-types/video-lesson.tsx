import { motion } from 'framer-motion';
import { ExternalLink, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Material {
  id: number;
  title: string;
  type: string;
  size: string;
  url: string;
}

interface VideoLessonProps {
  videoURL: string | null;
  materials: Material[];
}

const convertToEmbedUrl = (url?: string | null) => {
  if (!url) return null;
  if (url.includes('embed')) return url;

  try {
    const u = new URL(url);
    const videoId =
      u.searchParams.get('v') || url.split('youtu.be/')[1]?.split('?')[0];
    if (!videoId) return url;
    const t = u.searchParams.get('t');
    const startParam = t ? `?start=${parseInt(t.replace(/\D/g, ''), 10)}` : '';
    return `https://www.youtube.com/embed/${videoId}${startParam}`;
  } catch {
    return url;
  }
};

const VideoLesson = ({ videoURL, materials }: VideoLessonProps) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <>
      {/* VIDEO PLAYER */}
      <Card className="mb-4 overflow-hidden shadow-xl border-0">
        <motion.div initial="initial" animate="animate" variants={fadeInUp}>
          <div className="aspect-video bg-gradient-to-br from-gray-900 via-gray-800 to-black relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent" />
            <iframe
              src={convertToEmbedUrl(videoURL) || ''}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>
      </Card>

      {/* MATERIALS */}
      <Card className="shadow-xl border-0">
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          transition={{ delay: 0.1 }}
        >
          <div className="p-6">
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
          </div>
        </motion.div>
      </Card>
    </>
  );
};

export default VideoLesson;
